using backend.Models;
using backend1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            return Ok(await _context.Contacts.ToListAsync());
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact(int id)
        {
            var contact = await _context.Contacts
                .Include(c => c.Category)
                .Include(c => c.Subcategory)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
            {
                return NotFound();
            }

            var contactDto = new ContactDto
            {
                Id = contact.Id,
                Email = contact.Email,
                Password = contact.Password,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                PhoneNumber = contact.PhoneNumber,
                CategoryId = contact.CategoryId,
                CategoryName = contact.Category?.Name,
                SubcategoryId = contact.SubcategoryId,
                SubcategoryName = contact.Subcategory?.Name
            };

            return Ok(contactDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddContact([FromBody] Contact contact)
        {
            Console.WriteLine($"Received contact: {System.Text.Json.JsonSerializer.Serialize(contact)}");
            var existingContact = _context.Contacts.FirstOrDefault(c => c.Email == contact.Email);
            if (existingContact != null)
            {
                Console.WriteLine("Email already exists: " + contact.Email);
                return Conflict(new { error_message = "A contact with this email("+ contact.Email +") already exists." });
            }

            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState Errors: ");
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine(error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            if (contact.CategoryId == 3 && contact.Subcategory != null && !string.IsNullOrEmpty(contact.Subcategory.Name))
            {
                var existingSubcategory = _context.Subcategories
                    .FirstOrDefault(s => s.Name == contact.Subcategory.Name && s.CategoryId == contact.CategoryId);

                if (existingSubcategory == null)
                {
                    var newSubcategory = new Subcategory
                    {
                        Name = contact.Subcategory.Name,
                        CategoryId = contact.CategoryId
                    };

                    _context.Subcategories.Add(newSubcategory);
                    _context.SaveChanges();

                    contact.SubcategoryId = newSubcategory.Id;
                }
                else
                {
                    contact.SubcategoryId = existingSubcategory.Id;
                }
            }


            _context.Contacts.Add(contact);
            _context.SaveChanges();

            return Ok(contact);
        
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, [FromBody] ContactDto contactDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
                return NotFound();

            contact.Email = contactDto.Email;
            contact.Password = contactDto.Password;
            contact.FirstName = contactDto.FirstName;
            contact.LastName = contactDto.LastName;
            contact.PhoneNumber = contactDto.PhoneNumber;
            contact.CategoryId = contactDto.CategoryId;

            if (contactDto.CategoryId != 3 && !string.IsNullOrEmpty(contactDto.SubcategoryName))
            {
                var subcategory = await _context.Subcategories
                    .FirstOrDefaultAsync(s => s.Name == contactDto.SubcategoryName && s.CategoryId == contactDto.CategoryId);

                if (subcategory == null)
                    return BadRequest("Invalid subcategory name.");

                contact.SubcategoryId = subcategory.Id;
            }
            else if (contactDto.CategoryId == 3 && !string.IsNullOrEmpty(contactDto.SubcategoryName))
            {
                var subcategory = await _context.Subcategories
                .FirstOrDefaultAsync(s => s.Name == contactDto.SubcategoryName && s.CategoryId == contactDto.CategoryId);

                if (subcategory == null)
                    return BadRequest("Invalid subcategory name.");

                contact.SubcategoryId = subcategory.Id;
            }
            else
            {
                contact.SubcategoryId = null;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
